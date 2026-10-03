const encoder = new TextEncoder();

function toHex(bytes: Uint8Array): string {
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(value: string): ArrayBuffer | null {
    if (!/^(?:[0-9a-f]{2})+$/i.test(value)) {
        return null;
    }

    const buffer = new ArrayBuffer(value.length / 2);
    const bytes = new Uint8Array(buffer);
    for (let index = 0; index < bytes.length; index += 1) {
        bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
    }
    return buffer;
}

async function importSigningKey(secret: string): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
    );
}

export async function createAddProjectToken(
    secret: string,
    expiresAt: number
): Promise<string> {
    const payload = String(expiresAt);
    const key = await importSigningKey(secret);
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    return `${payload}.${toHex(new Uint8Array(signature))}`;
}

export async function verifyAddProjectToken(
    token: string | undefined,
    secret: string | undefined,
    now = Math.floor(Date.now() / 1000)
): Promise<boolean> {
    if (!token || !secret) {
        return false;
    }

    const [payload, signature, ...extraParts] = token.split(".");
    if (!payload || !signature || extraParts.length > 0 || !/^\d+$/.test(payload)) {
        return false;
    }

    const expiresAt = Number(payload);
    const signatureBytes = fromHex(signature);
    if (!Number.isSafeInteger(expiresAt) || expiresAt <= now || !signatureBytes) {
        return false;
    }

    const key = await importSigningKey(secret);
    return crypto.subtle.verify(
        "HMAC",
        key,
        signatureBytes,
        encoder.encode(payload)
    );
}
