import childProcess from 'child_process';
import path from 'path';

function openBrowser(url) {
  let cmd: string = '';
  const args: string[] = [];
  if (process.platform === 'darwin') {
    try {
      childProcess.execSync(
        `osascript openChrome.applescript "${encodeURI(url)}"`,
        {
          cwd: __dirname,
          stdio: 'ignore',
        },
      );
      return true;
    } catch (error) {
      console.log(error);
    }
    cmd = 'open';
  } else if (process.platform === 'win32') {
    cmd = 'cmd.exe';
    args.push('/c', 'start', '""', '/b');
    url = url.replace(/&/g, '^&');
  } else {
    cmd = 'xdg-open';
  }
  args.push(url);
  childProcess.spawn(cmd, args);
}
const [, , filePath] = process.argv;
openBrowser(path.join(process.cwd(), filePath));
