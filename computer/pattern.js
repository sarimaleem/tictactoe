const patterns = {
  xxxxx: -200000000,
  "-xxxx-": -50000,
  "xxxx-": -15000,
  "xx-xx": -420,
  "xxx-x": -420,
  "x-xxx-": -480,
  "-xxx-": -350,
  "xxx--": -300,
  "-xx-x": -100,
  "xx-x-": -100,
  "-xx-x-": -100,
  "--xx-": -3,
  "xx---": -3,
  "x---x": -3,
  "x----": -2,
  "--x--": -2,
  "-x---": -2,
  ooooo: 200000000,
  "-oooo-": 50000,
  "oooo-": 15000,
  "oo-oo": 420,
  "ooo-o": 420,
  "o-ooo-": 480,
  "-ooo-": 350,
  "ooo--": 300,
  "-oo-o": 100,
  "oo-o-": 100,
  "-oo-o-": 100,
  "--oo-": 3,
  "oo---": 3,
  "o---o": 3,
  "o----": 2,
  "--o--": 2,
  "-o---": 2,
};

export function scorePattern(pattern) {
  let revPattern = reverseString(pattern);

  let patScore = patterns[pattern];
  let revPatScore = patterns[revPattern];

  if (patScore !== undefined) {
    return patScore;
  } else if (revPatScore !== undefined) {
    return revPatScore;
  } else {
    return 0;
  }
}

function reverseString(s) {
  return s.split("").reverse().join("");
}
