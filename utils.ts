export const readFileAsString = async (filePath: string): Promise<string> => {
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(await Deno.readFile(filePath));
}
