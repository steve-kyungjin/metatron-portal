import * as $ from 'jquery';

export class Loading {

	/**
	 * 로딩 표시
	 */
	public static show(): void {
		$('#dt-full-loading').attr('aria-hidden', 'false');
	}

	/**
	 * 로딩 숨김
	 */
	public static hide(): void {
		$('#dt-full-loading').attr('aria-hidden', 'true');
	}

}
