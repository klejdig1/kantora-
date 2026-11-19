export async function simulateReconstruction(
  images: number,
  onProgress: (progress: number) => void,
  model = "lakeview_concept.glb",
) {
  if (images < 3 || images > 12)
    throw Error(
      "Select 3–12 overlapping views. This threshold does not establish photogrammetry suitability.",
    );
  for (const progress of [10, 30, 55, 80, 100]) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    onProgress(progress);
  }
  return {
    model: "/models/" + model,
    simulated: true,
    label:
      "Simulated preview — prebuilt architectural concept. No model was reconstructed from your photographs.",
  };
}
