function randomString(len: number): string {
    const validCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const validCharactersCount = validCharacters.length;

    let result = '';
    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * validCharactersCount);
        result += validCharacters.charAt(randomIndex);
    }

    return result;
}

export { randomString };
