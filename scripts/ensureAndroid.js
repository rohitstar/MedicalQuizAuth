/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const destination = path.join(projectRoot, 'android');
const templateRoot = path.join(
  projectRoot,
  'node_modules',
  '@react-native-community',
  'template',
  'template',
  'android',
);

const TEXT_EXTENSIONS = new Set([
  '.gradle',
  '.properties',
  '.xml',
  '.kt',
  '.java',
  '.pro',
  '.txt',
  '.bat',
  '',
]);

function walk(directory, callback) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

function replaceTemplateNames(filePath) {
  const extension = path.extname(filePath);
  const baseName = path.basename(filePath);
  if (!TEXT_EXTENSIONS.has(extension) && baseName !== 'gradlew') {
    return;
  }

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return;
  }

  const updated = content
    .replaceAll('com.helloworld', 'com.medicalquizapp')
    .replaceAll('HelloWorld', 'MedicalQuizApp');

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
  }
}

function ensureAndroidProject() {
  const mainActivity = path.join(
    destination,
    'app',
    'src',
    'main',
    'java',
    'com',
    'medicalquizapp',
    'MainActivity.kt',
  );

  if (fs.existsSync(mainActivity)) {
    console.log('Android project is ready.');
    return;
  }

  if (!fs.existsSync(templateRoot)) {
    throw new Error(
      'React Native Android template was not found. Run npm install before npm run android.',
    );
  }

  fs.rmSync(destination, {recursive: true, force: true});
  fs.cpSync(templateRoot, destination, {recursive: true});

  const originalPackage = path.join(
    destination,
    'app',
    'src',
    'main',
    'java',
    'com',
    'helloworld',
  );
  const renamedPackage = path.join(
    destination,
    'app',
    'src',
    'main',
    'java',
    'com',
    'medicalquizapp',
  );

  if (fs.existsSync(originalPackage)) {
    fs.mkdirSync(path.dirname(renamedPackage), {recursive: true});
    fs.renameSync(originalPackage, renamedPackage);
  }

  walk(destination, replaceTemplateNames);

  const gradlew = path.join(destination, 'gradlew');
  if (fs.existsSync(gradlew) && process.platform !== 'win32') {
    fs.chmodSync(gradlew, 0o755);
  }

  console.log('Android project generated successfully from the official React Native template.');
}

try {
  ensureAndroidProject();
} catch (error) {
  console.error(`Android setup failed: ${error.message}`);
  process.exit(1);
}
