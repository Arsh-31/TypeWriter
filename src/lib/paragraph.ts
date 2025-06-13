export async function getRandomParagraph(): Promise<string> {
  const response = await fetch(
    "https://baconipsum.com/api/?type=all-meat&paras=1&format=text&words=20"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch paragraph");
  }

  const paragraph = await response.text();
  return paragraph;
}
