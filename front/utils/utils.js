/*조건부 css를 사용할 때 중복 제거를 위해 사용하는 유틸리티 함수*/

export const cls = (...classnames) => {
  return classnames.join(" ");
};
