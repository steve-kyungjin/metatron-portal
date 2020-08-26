package app.metatron.portal.portal.communication.domain;

/**
 * 포스트의 상태 (요청형)
 */
public enum PostStatus {

    REQUESTED,  // 요청등록
    REVIEW,     // 요건검토*
    PROGRESS,   // 개발진행, 검증진행
    COMPLETED,  // 처리완료
    CANCELED,   // 요청취소
    CLOSED,     // 요청완료확인
    COMMENT     // 기타의견 추가의견 등..댓글의 상태에 대한 일관성 때문

}
