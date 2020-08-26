--
DELETE FROM mp_em_template;

--
INSERT INTO mp_em_template (id, created_date, updated_date, template, created_by, updated_by, subject) VALUES ('REQUEST_MOD', null, null, '<div style="width:650px;padding:10px;border:1px solid #eaeaea;font-size:14px;">
<p style="font-size:16px;"><strong>##__TITLE__##</strong></p><div style="padding:10px;"><div><strong>요청자</strong><p>##__CREATOR__##</p></div><div><strong>담당자</strong><p>##__WORKER__##</p></div><div><strong>상태</strong><p>##__STATUS__##</p></div><div><strong>내용</strong><p>##__BODY__##</p></div></div>
<br><p style="text-align:center;">* 내용은 전체 글의 일부만 보여질 수 있습니다. 세부 내용을 아래 링크를 통해 확인 바랍니다.</p><br><p style="text-align:center;"><a href="##__LINK__##" target="blank"><u>이동하기</u></a></p>
</div>', null, null, '(IDCube) 요청에 대한 관리 담당자 지정(또는 변경) 알림');
INSERT INTO mp_em_template (id, created_date, updated_date, template, created_by, updated_by, subject) VALUES ('REQUEST_REG', null, null, '<div style="width:650px;padding:10px;border:1px solid #eaeaea;font-size:14px;">
<p style="font-size:16px;"><strong>##__TITLE__##</strong></p><div style="padding:10px;"><div><strong>요청자</strong><p>##__CREATOR__##</p></div><div><strong>담당자</strong><p>##__WORKER__##</p></div><div><strong>상태</strong><p>##__STATUS__##</p></div><div><strong>내용</strong><p>##__BODY__##</p></div></div>
<br><p style="text-align:center;">* 내용은 전체 글의 일부만 보여질 수 있습니다. 세부 내용을 아래 링크를 통해 확인 바랍니다.</p><br><p style="text-align:center;"><a href="##__LINK__##" target="blank"><u>이동하기</u></a></p>
</div>', null, null, '(IDCube) 신규 요청 알림');
INSERT INTO mp_em_template (id, created_date, updated_date, template, created_by, updated_by, subject) VALUES ('REQUEST_RLY', null, null, '<div style="width:650px;padding:10px;border:1px solid #eaeaea;font-size:14px;">
<p style="font-size:16px;"><strong>##__TITLE__##</strong></p><div style="padding:10px;"><div><strong>요청자</strong><p>##__CREATOR__##</p></div><div><strong>담당자</strong><p>##__WORKER__##</p></div><div><strong>상태</strong><p>##__STATUS__##</p></div><div><strong>내용</strong><p>##__BODY__##</p></div></div>
<br><p style="text-align:center;">* 내용은 전체 글의 일부만 보여질 수 있습니다. 세부 내용을 아래 링크를 통해 확인 바랍니다.</p><br><p style="text-align:center;"><a href="##__LINK__##" target="blank"><u>이동하기</u></a></p>
</div>', null, null, '(IDCube) 요청글에 대한 댓글 등록 알림');


--
DELETE FROM mp_em_send;
