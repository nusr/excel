import { exec } from 'child_process';

export default function () {
  exec('npm run start', (error) => {
    if (!error) {
      console.log(error);
    }
  });
}
