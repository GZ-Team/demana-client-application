export function stringToBytes(value: string) {
  return [value].reduce(
    (bytes, character, characterIndex) => [...bytes, character.charCodeAt(characterIndex)],
    [] as number[]
  );
}
