export function convertDecimalToPoint(input: string): string {
  const numberToWords = (n: string): string => {
    const words = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    return n
      .split("")
      .map((digit) => words[parseInt(digit)])
      .join(" ");
  };

  return input.replace(/\d+\.\d+/g, (match) => {
    const [integerPart, decimalPart] = match.split(".");
    return `${numberToWords(integerPart)} point ${numberToWords(decimalPart)}`;
  });
}

export function replaceFullStopsWithCommas(input: string): string {
  return input.replace(/\./g, ",");
}
