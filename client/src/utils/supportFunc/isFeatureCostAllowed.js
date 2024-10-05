const isFeatureCostAllowed = (feature, points) => {
  if (!feature.cost || points - feature.cost >= 0) return true;
  return false;
};

export default isFeatureCostAllowed;
