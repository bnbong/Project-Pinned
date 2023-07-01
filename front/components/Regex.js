const Regex = (id) => {
  if (id == "email") {
    const emailRegex =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    if (!emailRegex.test(prop.value)) {
      setCorrect({
        ...correct,
        email_correct: false,
      });
      return "이메일 형식에 맞춰서 작성해주세요.";
    }
  }
  if (id == "username") {
    //2자 이상 16자 이하, 영어 또는 숫자 또는 한글로 구성
    const nameRegex = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,16}$/;
    if (!nameRegex.test(prop.value)) {
      setCorrect({
        ...correct,
        username_correct: false,
      });
      return "사용자 이름은 한글/영어/숫자만 가능합니다.";
    }
  }
  if (id == "password") {
    //최소 8 자, 하나 이상의 문자, 하나의 숫자 및 하나의 특수 문자 정규식
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(prop.value)) {
      setCorrect({
        ...correct,
        password_correct: false,
      });
      return "비밀번호는 한글/영어/숫자 조합 8자 이상이어야 합니다.";
    }
  }
};
useEffect(validation, [prop.value]);

export default Regex;
