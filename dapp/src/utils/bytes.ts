export const fromU32NumberToU8Bytes = (u32Number: number) => {
    return new Uint8Array(new Uint32Array([u32Number]).buffer);
};
