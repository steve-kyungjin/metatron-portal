import {ElementRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/bufferCount';
import {NGXLogger} from 'ngx-logger';
import {Subscription} from 'rxjs/Subscription';
import {GnbService} from '../../layout/gnb/service/gnb.service';
import {CodeService} from '../service/code.service';
import {SessionInfo} from '../service/session-info.service';
import {Tagging} from "../value/tagging";
import {TaggingService} from "../service/tagging.service";
import {LayoutService} from "../../layout/service/layout.service";

declare const $: any;

export abstract class AbstractComponent implements OnInit, OnDestroy {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Private Variables
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// TaggingService
	private taggingService: TaggingService;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Protected Variables
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// Subscription
	protected subscriptions: Subscription[] = [];

	// Location
	protected location: Location;

	// Router
	protected router: Router;

	// Activated Route
	protected activatedRoute: ActivatedRoute;

	/**
	 * 글로벌 JQuery 객체
	 *  - jQuery 플러그인 형태 라이브러리 사용하는 경우 사용
	 *
	 * @type {any}
	 */
	protected jQuery = $;

	// 현재 Element JQuery 객체
	protected $element: JQuery;

	// Logger
	protected logger: NGXLogger;

	// GnbService
	protected gnbService: GnbService;

	// CodeService
	protected codeService: CodeService;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Public Variables
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	// 어플리케이션 공용 값 저장소
	public sessionInfo: SessionInfo;

	// 태깅 타입
	public TaggingType: typeof Tagging.Type = Tagging.Type;

	// 태깅 액션
	public TaggingAction: typeof Tagging.Action = Tagging.Action;

	// LayoutService
	protected layoutService: LayoutService;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Constructor
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	protected constructor(protected elementRef: ElementRef,
						  protected injector: Injector) {

		this.sessionInfo = injector.get(SessionInfo);
		this.router = injector.get(Router);
		this.location = injector.get(Location);
		this.activatedRoute = injector.get(ActivatedRoute);
		this.logger = injector.get(NGXLogger);
		this.gnbService = injector.get(GnbService);
		this.codeService = injector.get(CodeService);
		this.taggingService = injector.get(TaggingService);
		this.layoutService = injector.get(LayoutService);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Override Method
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

		// 현재 컴포넌트 jQuery 객체
		this.$element = this.jQuery(this.elementRef.nativeElement);
	}

	public ngOnDestroy(): void {

		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});

		if (this.$element) {
			// 현재 엘리먼트 하위의 모든 on 이벤트 해제
			this.$element.find('*').off();
		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Public Method
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 태깅
	 * @param type
	 * @param action
	 * @param value
	 * @param valueTitle
	 */
	public tagging(type: Tagging.Type, action: Tagging.Action, value: string, valueTitle: string = null) {
		try {
			let tagging = new Tagging.Entity();
			tagging.action = action;
			tagging.type = type;
			tagging.var = (valueTitle ? `${valueTitle},` : '') + value.replace(/,/g, '_');

			if (this.router.url.indexOf('view/intro') > -1) {
				tagging.module = this.layoutService.iaCodes.introIaCode;
			} else if (this.router.url.indexOf('view/search') > -1) {
				tagging.module = this.layoutService.iaCodes.introIaCode;
			} else {
				try {
					tagging.module = this.gnbService.permission.id;
				} catch (e) {
				}
			}

			this.taggingService.postTagging(tagging);
		} catch (e) {

		}
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Protected Method
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 현제 컴포넌트 전체 경로
	 */
	protected getFullPath(): string {
		return this.router.url;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
     | Private Method
     |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

}
