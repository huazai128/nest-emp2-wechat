import { BehaviorStack, BehaviorRecordsOptions } from "./interfaces";

/**
 * 记录用户行为
 * @export
 * @class BehaviorStore
 */
export default class BehaviorStore {
    private state: Array<BehaviorStack>
    private max: number
    constructor({ maxBehaviorRecords }: BehaviorRecordsOptions) {
        this.max = maxBehaviorRecords
        this.state = []
    }
    // 从底部插入一个元素，且不超过 maxBehaviorRecords 限制数量
    push(value: BehaviorStack) {
        if (this.length() === this.max) {
            this.shift();
        }
        this.state.push(value);
    }

    // 从顶部删除一个元素，返回删除的元素
    shift() {
        return this.state.shift();
    }

    length() {
        return this.state.length;
    }

    get() {
        return this.state;
    }

    clear() {
        this.state = [];
    }

}