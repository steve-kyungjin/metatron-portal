package app.metatron.portal.portal.communication.domain;

/**
 * 커뮤니케이션 통합 조회를 위한 필터 타입
 */
public enum FilterType {

    // 요청형
    // 전체보기, 내가 등록한 요청
    REQ_ALL,
    // 최근 3일간 요층등록내역
    REQ_LAST_3D,
    // 내가 등록한 미답변 요청, 미답변 요청 전체
    REQ_NOT_PROC,
    // 내가 등록한 처리 진행중 요청, 처리 진행중 요청 전체
    REQ_INCOMPL,
    // 내가 등록한 처리완료 요청, 처리완료 요청 전체
    REQ_COMPL,
    // 검토 진행중 요청 전체
    REQ_REVIEW,
    // 개발 진행중 요청 전체
    REQ_PROG_NOR,
    // 검증 진행중 요청 전체
    REQ_PROG_REV,
    // 담당자 미지정 요청 전체
    REQ_NO_WOR,
    // 처리자 미지정 요청 전체
    REQ_NO_COWOR,
    // 내가 담당자인 요청
    REQ_WOR,
    // 내가 처리자인 요청
    REQ_COWOR,

    // Q&A
    // 전체보기, 내가 등록한 Q&A
    QNA_ALL,
    // 내가 등록한 미답변 Q&A, 미답변 Q&A 전체
    QNA_NO_ANS,
    // 내가 등록한 답변 Q&A, 답변 Q&A 전체
    QNA_ANS,

    // 공지 및 가이드
    // 전체보기
    GUD_ALL,
    // 최근 3일 이내 등록된 글
    GUD_LAST_3D,
    // 최근 일주일 내 등록된 글
    GUD_LAST_7D,
    // Guide & tip
    GUD_TIP
}
