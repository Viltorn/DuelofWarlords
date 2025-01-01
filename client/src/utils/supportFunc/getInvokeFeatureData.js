const getInvokeFeatureData = (feature) => {
  if (feature.name !== 'invoke') {
    return null;
  }
  return feature.value;
};

export default getInvokeFeatureData;
