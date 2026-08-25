import { CopyrightResult } from "./types";

export const SAMPLE_CODE_INPUT = `function validateToken(token) {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret, (err, decoded) => {
    if (err) throw new AuthError('Invalid');
    return decoded;
  });
}

def encrypt_payload(data, key):
    cipher = AES.new(key, AES.MODE_GCM)
    ciphertext, tag = cipher.encrypt_and_digest(data)
    return (cipher.nonce, ciphertext, tag)`;

export const MOCK_COPYRIGHT_RESULT: CopyrightResult = {
  riskIndex: 84,
  fragmentsFound: 12,
  repositoryCount: 4,
  vectors: [
    {
      id: "vec-1",
      filename: "AuthCore.js",
      repository: "OpenSecure/Auth-v2",
      matchPercentage: 92,
      lines: [
        { lineText: "function validateToken(token) {", isMatched: false },
        { lineText: "  const secret = process.env.JWT_SECRET;", isMatched: false },
        {
          lineText: "  return jwt.verify(token, secret, (err, decoded) => {",
          isMatched: true,
        },
        {
          lineText: "    if (err) throw new AuthError('Invalid');",
          isMatched: true,
        },
        { lineText: "    return decoded;", isMatched: false },
        { lineText: "  });", isMatched: false },
        { lineText: "}", isMatched: false },
      ],
    },
    {
      id: "vec-2",
      filename: "utils/encryption.py",
      repository: "DataVault/PyCryptoTools",
      matchPercentage: 45,
      lines: [
        { lineText: "def encrypt_payload(data, key):", isMatched: false },
        { lineText: "    cipher = AES.new(key, AES.MODE_GCM)", isMatched: false },
        {
          lineText: "    ciphertext, tag = cipher.encrypt_and_digest(data)",
          isMatched: true,
        },
        { lineText: "    return (cipher.nonce, ciphertext, tag)", isMatched: false },
      ],
    },
  ],
};
