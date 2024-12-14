export function convertDecimalToPoint(input: string): string {
  const numberToWords = (n: string): string => {
    const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
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

export const stripMarkdown = (markdown: string) => {
  // Remove headers
  let text = markdown.replace(/#{1,6}\s/g, "");

  // Remove bold/italic
  text = text.replace(/[*_]{1,3}(.*?)[*_]{1,3}/g, "$1");

  // Remove links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/`([^`]+)`/g, "$1");

  // Remove lists and convert to more conversational format
  text = text.replace(/^[\s]*[-+*][\s]+/gm, "");

  // Custom transformation to make it more conversational
  text = text.replace(/(\d+)\.\s*([^:\n]+):/g, "Option $1 is $2, which ");

  // Replace colons with more natural language
  text = text.replace(/:\s*/g, " is ");

  // Add connecting words and make it flow better
  text = text
    .split("\n")
    .map((line) => {
      // Remove extra whitespace
      line = line.trim();

      // Skip empty lines
      if (!line) return "";

      // Add some natural language transitions
      if (line.startsWith("Program")) return `The academic program ${line.toLowerCase()}`;
      if (line.startsWith("Location")) return `Located in ${line.replace("Location", "").trim()}`;
      if (line.startsWith("Cost")) return `with a cost of ${line.replace("Cost", "").trim()}`;
      if (line.startsWith("Ranking"))
        return `and has a national ranking of ${line.replace("Ranking", "").trim()}`;
      if (line.startsWith("Key Roles"))
        return `Graduates can pursue careers such as ${line.replace("Key Roles", "").trim()}`;
      if (line.startsWith("Specializations"))
        return `with specializations in ${line.replace("Specializations", "").trim()}`;
      if (line.startsWith("Duration"))
        return `and can be completed in ${line.replace("Duration", "").trim()}`;

      return line;
    })
    .filter((line) => line)
    .join(". ");

  return text.trim();
};

export const Bye_Schedule_Message =
  "Thank you for talking, you can schedule a call with one of our agents";
