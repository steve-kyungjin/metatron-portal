import {AfterViewInit, Component, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {DataSource} from '../value/data-source';
import {DataSourceService} from '../service/data-source.service';
import {TranslateService} from 'ng2-translate';
import {HiveComponent} from './hive/hive.component';
import {MysqlComponent} from './mysql/mysql.component';
import {AbstractComponent} from '../../../../common/component/abstract.component';
import {SelectValue} from '../../../../../common/component/select/select.value';
import {SelectComponent} from '../../../../../common/component/select/select.component';
import {DialogService} from '../../../../../common/component/dialog/dialog.service';
import {Alert} from '../../../../../common/util/alert-util';
import {Validate} from '../../../../../common/util/validate-util';
import {Loading} from '../../../../../common/util/loading-util';
import {CommonConstant} from '../../../../common/constant/common-constant';
import DatabaseType = DataSource.DatabaseType;

/**
 * DataSource namespace 의 DatabaseType enum 을 템플릿에서 바로 사용할 수 없어서 한 번더 감싸서 사용하기 위한 클래스
 */
export class DataSourceDatabaseType {
	MYSQL: DataSource.DatabaseType = DataSource.DatabaseType.MYSQL;
	HIVE: DataSource.DatabaseType = DataSource.DatabaseType.HIVE;
}

@Component({
	selector: '[data-source]',
	templateUrl: './data-source.component.html',
	host: { '[class.layout-popup]': 'true' }
})
export class DataSourceComponent extends AbstractComponent implements OnInit, OnDestroy, AfterViewInit {

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Constant
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * TODO: 사용 가능한 데이터베이스 종류
	 *
	 * @type {SelectValue[]}
	 */
	public DATABASE_TYPE_LIST: SelectValue[] = [
		new SelectValue('MySQL', DataSource.DatabaseType.MYSQL, true),
		new SelectValue('Hive', DataSource.DatabaseType.HIVE, false)
	];

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
	| Private Variables
	|-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	@Output('cancel')
	private oCancelEvent: EventEmitter<any> = new EventEmitter();

	@Output('done')
	private oDoneEvent: EventEmitter<any> = new EventEmitter();

	@ViewChild('selectBox')
	private selectBox: SelectComponent;

	@ViewChild('dataBaseInformation')
	private dataBaseInformation: HiveComponent | MysqlComponent;

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Variables
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public dataSourceEntity: DataSource.Entity = new DataSource.Entity();

	public dataSourceDatabaseType: DataSourceDatabaseType = new DataSourceDatabaseType();

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Constructor
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	constructor(protected elementRef: ElementRef,
				protected injector: Injector,
				public translateService: TranslateService,
				private dataSourceService: DataSourceService,
				private dialogService: DialogService) {
		super(elementRef, injector);
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Override Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	public ngOnInit(): void {

	}

	public ngAfterViewInit(): void {
		this.dataSourceEntity.databaseType = this.selectBox.getSelectedItem().value;
	}

	public ngOnDestroy(): void {
		super.ngOnDestroy();
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Public Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 취소
	 */
	public cancel(): void {
		this.oCancelEvent.emit();
	}

	/**
	 * 적용
	 */
	public done(): void {

		if (this.dataSourceEntity.databaseType === null) {
			Alert.warning(`데이터베이스 종류를 선택해주세요.`);
			return;
		}

		if (Validate.isEmpty(this.dataSourceEntity.name)) {
			Alert.warning(`데이터 소스 이름을 입력해주세요.`);
			return;
		}

		if (Validate.isEmpty(this.dataBaseInformation.dataSourceEntity.host)) {
			Alert.warning(`Host를 입력해주세요.`);
			return;
		}

		this.dataSourceEntity.host = this.dataBaseInformation.dataSourceEntity.host;

		if (Number(this.dataBaseInformation.dataSourceEntity.port) < 0) {
			Alert.warning(`Port를 입력하세요.`);
			return;
		}

		if (Number(this.dataBaseInformation.dataSourceEntity.port) === 0) {
			Alert.warning(`Port를 입력하세요.`);
			return;
		}

		if (Number(this.dataBaseInformation.dataSourceEntity.port) > 2147483647) {
			Alert.warning(`Port 최대 값은 2,147,483,647 입니다.`);
			return;
		}

		this.dataSourceEntity.port = this.dataBaseInformation.dataSourceEntity.port;

		if (this.dataSourceEntity.databaseType === DatabaseType.MYSQL) {
			if (Validate.isEmpty(this.dataBaseInformation.dataSourceEntity.databaseNm)) {
				Alert.warning(`데이터베이스 이름을 입력하세요.`);
				return;
			}
		}

		this.dataSourceEntity.databaseNm = this.dataBaseInformation.dataSourceEntity.databaseNm;
		this.dataSourceEntity.databaseUser = this.dataBaseInformation.dataSourceEntity.databaseUser;
		this.dataSourceEntity.databasePassword = this.dataBaseInformation.dataSourceEntity.databasePassword;

		this.testDataSourceConnection();
	}

	/**
	 * 데이터베이스 타입 셀렉트 박스 아웃풋 이벤트 받을 함수
	 *
	 * @param {SelectValue} $event
	 */
	public dataBaseTypeSelect($event: SelectValue): void {
		this.dataSourceEntity.databaseType = $event.value;
	}

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Protected Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    | Private Method
    |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

	/**
	 * 데이터 소스 커넥션 테스트
	 */
	private testDataSourceConnection(): void {

		Loading.show();

		this.dataSourceService
			.testDataSourceConnection(this.dataSourceEntity)
			.then(result => {

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					this.createDataSource();
				} else {
					this.dataSourceConnectionTestIsFail();
				}
			})
			.catch(error => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] > error`, error);
			});

	}

	/**
	 * 데이터 소스 생성
	 */
	private createDataSource(): void {

		this.dataSourceService
			.createDataSource(this.dataSourceEntity)
			.then(result => {

				this.logger.debug(`[${this[ '__proto__' ].constructor.name}] result`, result);

				if (result.code === CommonConstant.CODE.RESULT_CODE.SUCCESS) {
					Alert.success(`저장 되었습니다.`);
					this.oDoneEvent.emit();
				} else {
					this.dataSourceConnectionTestIsFail();
				}

				Loading.hide();
			})
			.catch((error) => {
				this.logger.error(`[${this[ '__proto__' ].constructor.name}] > error`, error);
			});
	}

	/**
	 * 데이터 소스 커넥션 테스트 실패시
	 */
	private dataSourceConnectionTestIsFail() {

		Loading.hide();

		this.dialogService.confirm(
			this.translateService.instant('COMMON.CREATE', '등록'),
			this.translateService.instant('MANAGEMENT.CREATE.ENTER.INFORMATION.DATASOURCE', '데이터 소스 연결 테스트에 실패했습니다.\n저장하시겠습니까?'),
			null,
			this.translateService.instant('COMMON.CANCEL', '취소'),
			this.translateService.instant('COMMON.CONFIRM', '확인'),
			() => {

			},
			() => {

				Loading.show();

				this.createDataSource();
			});
	}
}
