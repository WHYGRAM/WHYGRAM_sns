package com.koreait.whygram.service;

import com.koreait.whygram.common.EmailService;
import com.koreait.whygram.common.MySecurityUtils;
import com.koreait.whygram.mapper.UserMapper;
import com.koreait.whygram.model.user.UserEntity;
import com.koreait.whygram.security.IAuthenticationFacade;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class UserService {

    @Autowired private UserMapper mapper;
    @Autowired private MySecurityUtils mySecurityUtils;
    @Autowired private EmailService email;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private IAuthenticationFacade auth;

    // 이메일 중복확인
    public int selEmail(UserEntity param) {
        int result = mapper.selEmail(param).getEmailCheck();
        return result;
    }

    // 닉네임 중복확인
    public int selNickNm(UserEntity param) {
        int result = mapper.selNickNm(param).getNickNmCheck();
        return result;
    }

    // 아이디 중복 검사 & 비밀번호 확인 검사
    public String idPwChk(UserEntity param, String pwchk) {
        int idChk = mapper.selEmail(param).getEmailCheck();

        if (idChk == 0) { // 아이디 중복값 없음
            if (param.getUsers_password().equals(pwchk)) { // 비밀번호 서로 일치
                return "done"; // 아이디 비밀번호 모두 통과
            }
            // 비밀번호 불일치
            return "pw";
        }
        // 아이디 중복값 있음
        return "id";
    }

    // 회원가입
    public String insUsers(UserEntity param, String pwchk) {

        // 아이디, 비밀번호 검사
        String idPwChk = this.idPwChk(param, pwchk);
        if (idPwChk.equals("pw") || idPwChk.equals("id")) {
            return "/whygram?msg=wrongAccess";
        }

        // 인증번호
        String authCd = mySecurityUtils.getRandomCode(5);

        // 비밀번호 암호화
        String hashedPw = passwordEncoder.encode(param.getUsers_password());

        // UserEntity 설정
        param.setUsers_password(hashedPw);
        param.setUsers_auth_code(authCd);

        //회원가입 처리
        int result = mapper.insUsers(param);
        param.setUsers_password("");

        //회원가입 인증 이메일
        if(result == 1) {
            String subject = "[WHYGRAM] 인증메일입니다.";
            String txt = String.format("<a href=\"http://localhost:8090/user/auth?users_email=%s&users_auth_code=%s\">인증하기</a>"
                    , param.getUsers_email(), authCd);
            email.sendMimeMessage(param.getUsers_email(), subject, txt);
            return "/whygram?msg=authCode";
        }

        //회원가입 처리 중 에러 발생
        return "/whygram?msg=joinErr";
    }

    //이메일 인증 처리
    public String auth(UserEntity param) {
        int result = mapper.auth(param);
        if (result == 1) {
            return "authDone";
        }
        return "authErr";
    }

    //비밀번호 찾기
    public int findPw(UserEntity param) {
        // 인증번호
        String authCd = mySecurityUtils.getRandomCode(5);

        //임시비밀번호 설정
        String hashedPw = passwordEncoder.encode(authCd);
        param.setUsers_password(hashedPw);
        //임시비밀번호 설정 성공 && 입력된 정보와 일치하는 사용자
        if (mapper.updPw(param) == 1 && mapper.selEmail(param).getEmailCheck() == 1 && mapper.selNickNm(param).getNickNmCheck() == 1) {
            String subject = "[WHYGRAM] 임시비밀번호 입니다.";
            String txt = String.format("<p>%s님의 임시비밀번호 : %s<p><a href=\"http://localhost:8090/whygram\">다시 로그인하러 가기</a>",
                    param.getUsers_nickname(), authCd);
            email.sendMimeMessage(param.getUsers_email(), subject, txt);
            return 1;
        }

        //임시비밀번호 설정 실패 또는 이메일과 닉네임이 없다
        return 0;
    }

    // 프로필 이미지 변경
    public void profileImg(MultipartFile[] imgArr) {
        UserEntity loginUser = auth.getLoginUser();
        int iuser = loginUser.getUsers_id();
    }
}
