export function $N(value: any, ifnull: any) {
  if (value === null || value === undefined) {
    return ifnull;
  }
  return value;
}

export function handleInput(input: string) {
  if (input === "-") {
    return input;
  }

  let num = Number.parseFloat(input);
  if (isNaN(num)) {
    return "";
  }

  return num;
}
