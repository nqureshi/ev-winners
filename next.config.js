/** @type {import('next').NextConfig} */
const nextConfig = {
    // Keep the native ONNX runtime out of the bundle; it is loaded at runtime.
    serverExternalPackages: ['onnxruntime-node'],
    // Include the model and ONNX's Linux shared libraries. The native binding
    // loads libonnxruntime.so dynamically, so automatic tracing can miss it.
    outputFileTracingIncludes: {
        '/api/similarity': [
            './models/**/*',
            './node_modules/onnxruntime-node/bin/napi-v3/linux/**/*',
        ],
    },
};

module.exports = nextConfig
