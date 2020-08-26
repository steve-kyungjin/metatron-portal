import {ISerializable} from '../interface/serializable.interface';
import {User} from './user';

export namespace Abstract {

	export class Entity implements ISerializable {

		createdBy: User.Entity;
		updatedBy: User.Entity;
		createdDate: string;
		updatedDate: string;

	}

}
