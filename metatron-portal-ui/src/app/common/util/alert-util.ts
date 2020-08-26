declare const toastr: any;

toastr.options = {
	'closeButton': true,
	'debug': false,
	'positionClass': 'toast-top-center',
	'onclick': null,
	'showDuration': '3000',
	'hideDuration': '1000',
	'timeOut': '3000',
	'extendedTimeOut': '3000',
	'showEasing': 'swing',
	'hideEasing': 'linear',
	'showMethod': 'fadeIn',
	'hideMethod': 'fadeOut',
	'progressBar': false
};

/**
 * Alert(Toastr) 유틸
 */
export class Alert {

	/**
	 * Information Alert
	 *
	 * @param {string} message
	 */
	public static info(message: string): void {
		toastr.info(message.replace(/\n/gi, '<br>'));
	}

	/**
	 * Success Alert
	 *
	 * @param {string} message
	 */
	public static success(message: string): void {
		toastr.success(message.replace(/\n/gi, '<br>'));
	}

	/**
	 * Warning Alert
	 *
	 * @param {string} message
	 */
	public static warning(message: string): void {
		toastr.warning(message.replace(/\n/gi, '<br>'));
	}

	/**
	 * Error Alert
	 *
	 * @param {string} message
	 */
	public static error(message: string): void {
		toastr.error(message.replace(/\n/gi, '<br>'));
	}

}
