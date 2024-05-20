// export function request(ctx: any) {
//     return {
//       method: "POST",
//       resourcePath: "/",
//       params: {
//         body: {
//           Image: {
//             S3Object: {
//               Bucket: ctx.env.S3_BUCKET_NAME,
//               Name: ctx.arguments.path,
//             },
//           },
//         },
//         headers: {
//           "Content-Type": "application/x-amz-json-1.1",
//           "X-Amz-Target": "RekognitionService.DetectText",
//         },
//       },
//     };
//   }
  
//   export function response(ctx: any) {
//     return JSON.parse(ctx.result.body)
//       .TextDetections.filter((item: any) => item.Type === "LINE")
//       .map((item: any) => item.DetectedText)
//       .join("\n")
//       .trim();
//   }