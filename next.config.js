/** @type {import('next').NextConfig} */
const nextConfig = {
    // Keep the native ONNX runtime out of the bundle; it is loaded at runtime.
    serverExternalPackages: ['onnxruntime-node'],
    // The similarity route reads the vendored model files at runtime.
    outputFileTracingIncludes: {
        '/api/similarity': ['./models/**/*'],
    },
};

module.exports = nextConfig
