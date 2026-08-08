const fs = require("fs");
const path = require("path");

const BOARD_URL = "https://www.naesoo.or.kr/Board/Index/77077";
const SITE_ORIGIN = "https://www.naesoo.or.kr";
const DEFAULT_ORIGINAL_DIR = path.resolve(process.cwd(), "../../original");

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const force = args.has("--force");
const overwrite = args.has("--overwrite");
const originalDir = process.env.ORIGINAL_DIR
  ? path.resolve(process.env.ORIGINAL_DIR)
  : DEFAULT_ORIGINAL_DIR;

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .trim();
}

function absolutize(url) {
  const clean = decodeHtml(url).trim();
  return new URL(clean, SITE_ORIGIN).toString();
}

function parseKoreanDate(title) {
  const match = title.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (!match) {
    throw new Error(`게시물 제목에서 날짜를 찾지 못함: ${title}`);
  }
  const [, year, month, day] = match;
  const mm = month.padStart(2, "0");
  const dd = day.padStart(2, "0");
  return {
    id: `${year}-${mm}-${dd}`,
    folder: `${year.slice(2)}${mm}${dd}`,
    label: `${year}.${mm}.${dd}`,
    display: `${year}년 ${Number(month)}월 ${Number(day)}일`,
  };
}

function parseLatestPost(html) {
  const postPattern = /<a\s+href=["']([^"']*\/Board\/Detail\/77077\/\d+)["'][^>]*>([^<]*주보[^<]*)<\/a>/gi;
  const match = postPattern.exec(html);
  if (!match) {
    throw new Error("주보 목록에서 최신 게시물을 찾지 못함");
  }
  const title = decodeHtml(match[2]).replace(/\s+/g, " ");
  return {
    title,
    href: absolutize(match[1]),
    ...parseKoreanDate(title),
  };
}

function parseDetailAssets(html) {
  const images = [];
  const imgPattern = /<img\s+[^>]*src=["']([^"']+)["'][^>]*(?:alt|title)=["']([^"']+)["'][^>]*>/gi;
  let imgMatch;
  while ((imgMatch = imgPattern.exec(html))) {
    const url = absolutize(imgMatch[1]);
    const filename = decodeHtml(imgMatch[2]);
    if (!/\.(jpe?g|png|pdf)$/i.test(filename)) continue;
    images.push({ url, filename, source: "image" });
  }

  const attachments = [];
  const filePattern = /<a\s+[^>]*class=["'][^"']*each-file[^"']*["'][^>]*data-href=["']([^"']+)["'][^>]*filename=["']([^"']+)["'][^>]*>/gi;
  let fileMatch;
  while ((fileMatch = filePattern.exec(html))) {
    attachments.push({
      url: absolutize(fileMatch[1]),
      filename: decodeHtml(fileMatch[2]),
      source: "attachment",
    });
  }

  const chosen = images.length ? images : attachments;
  return chosen
    .filter((asset, index, list) => list.findIndex((item) => item.filename === asset.filename) === index)
    .sort((a, b) => pageNumber(a.filename) - pageNumber(b.filename));
}

function pageNumber(filename) {
  const match = filename.match(/_(\d+)\.[^.]+$/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function sanitizeFilename(filename) {
  return filename.replace(/[\\/:\0]/g, "_").trim();
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 NaesooMobileBulletinBot/1.0",
      "accept": "*/*",
    },
  });
  if (!response.ok) {
    throw new Error(`다운로드 실패 ${response.status}: ${url}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 NaesooMobileBulletinBot/1.0",
      "accept": "text/html,application/xhtml+xml",
    },
  });
  if (!response.ok) {
    throw new Error(`페이지 요청 실패 ${response.status}: ${url}`);
  }
  return response.text();
}

function readCurrentIssue() {
  const archivePath = path.resolve(process.cwd(), "archive.json");
  if (!fs.existsSync(archivePath)) return null;
  return JSON.parse(fs.readFileSync(archivePath, "utf8")).current || null;
}

function writeManifest(targetDir, latest, assets, downloaded) {
  const manifest = {
    checkedAt: new Date().toISOString(),
    boardUrl: BOARD_URL,
    detailUrl: latest.href,
    title: latest.title,
    issue: latest.id,
    folder: latest.folder,
    assets: assets.map((asset, index) => ({
      order: index + 1,
      filename: asset.filename,
      source: asset.source,
      url: asset.url,
      downloaded: downloaded.includes(asset.filename),
    })),
    nextSteps: [
      "이미지 원문 확인",
      "주보 JSON 생성 또는 갱신",
      "오탈자 검수",
      "npm test 실행",
      "로컬 미리보기 확인",
      "사용자 승인 후 GitHub 푸시",
    ],
  };
  fs.writeFileSync(path.join(targetDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

async function main() {
  const listHtml = await fetchText(BOARD_URL);
  const latest = parseLatestPost(listHtml);
  const currentIssue = readCurrentIssue();
  const targetDir = path.join(originalDir, latest.folder);

  console.log(`latest=${latest.id} title="${latest.title}"`);
  console.log(`current=${currentIssue || "unknown"}`);
  console.log(`detail=${latest.href}`);
  console.log(`target=${targetDir}`);

  if (currentIssue === latest.id && !force) {
    console.log("status=already-current");
    console.log("hint=새 글이 감지되면 npm run bulletin:fetch 실행, 현재 주보를 다시 받으려면 npm run bulletin:fetch:force 실행");
    return;
  }

  const detailHtml = await fetchText(latest.href);
  const assets = parseDetailAssets(detailHtml);
  if (!assets.length) {
    throw new Error("상세 게시물에서 이미지 또는 첨부파일을 찾지 못함");
  }

  console.log(`assets=${assets.length}`);
  assets.forEach((asset, index) => console.log(`${index + 1}. ${asset.filename} (${asset.source})`));

  if (dryRun) {
    console.log("status=dry-run");
    return;
  }

  fs.mkdirSync(targetDir, { recursive: true });
  const downloaded = [];
  for (const asset of assets) {
    const filename = sanitizeFilename(asset.filename);
    const outputPath = path.join(targetDir, filename);
    if (fs.existsSync(outputPath) && !overwrite) {
      console.log(`skip=${filename}`);
      downloaded.push(filename);
      continue;
    }
    const data = await fetchBuffer(asset.url);
    fs.writeFileSync(outputPath, data);
    downloaded.push(filename);
    console.log(`saved=${outputPath}`);
  }

  writeManifest(targetDir, latest, assets, downloaded);
  console.log("status=downloaded");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
