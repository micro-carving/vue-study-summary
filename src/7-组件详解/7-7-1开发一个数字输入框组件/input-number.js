/*子组件相关属性*/
// 验证传入的数据是否为数值类型的
function isValueNumber(value) {
    return (/(^-?[0-9]+\.{1}\d+$) | (^-?[1-9][0-9]*$) | (^-?0{1}$)/).test(value + '');
}
Vue.component('input-number', {
    template: '\
        <div class="input-number">\
            <input\
                type="text" \
                :value="currentValue"\
                @change="handleChangeValue">\
            <button\
                @click="handleDecrease"\
                :disabled="currentValue <= min">-</button>\
            <button\
                @click="handleIncrease"\
                :disabled="currentValue >= max">+</button>\
        </div>',
    props: {
        max: {
            type: Number,
            default: Infinity /*无限*/
        },
        min: {
            type: Number,
            default: -Infinity
        },
        value: {
            type: Number,
            default: 0
        }
    },
    // 因为Vue组件中是单向的数据流，所以无法从组件内部直接修改prop value的值，为了解决这个问题，
    // 需要给组件声明一个data方法，默认引用value的值，通过组件内部维护这个data
    data: function () {
        return {
            currentValue: this.value
        }
    },
    mounted: function () {
        // 钩子函数中使用此方法是为了第一次初始化时，对value的值进行过滤
        this.updateValue(this.value);
    },
    // 另一种写法与钩子函数实现相同的效果
    /*data: function() {
        let val = this.value;
        if (val > this.max) {
            val = this.max;
        }
        if (val < this.min) {
            val = this.min;
        }
        return {
            currentValue: val
        }
    },*/
    watch: {
        currentValue: function (val) {
            // 在使用v-model时改变value
            this.$emit('input', val);
            // 自定义触发事件，用于稿子父组件数字输入框的值改变（示例中没有使用该事件）
            this.$emit('on-change', val);
        },
        value: function (val) {
            // 此处能使用this.updateValue方法是因为Vue代理了props、data、computed及methods
            this.updateValue(val);
        }
    },
    methods: {
        // 此方法使用用于过滤父组件传递过来的不符合当前条件的数据
        updateValue: function (val) {
            if (val > this.max) {
                val = this.max;
            }
            if (val < this.min) {
                val = this.min;
            }
            this.currentValue = val;
        },
        handleDecrease: function () {
            if (this.currentValue <= this.min) {
                return;
            }
            this.currentValue -= 1;
        },
        handleIncrease: function () {
            if (this.currentValue >= this.max) {
                return;
            }
            this.currentValue += 1;
        },
        handleChangeValue: function (event) {
            let val = event.target.value.trim();
            let max = this.max;
            let min = this.min;
            if (isValueNumber(val)) {
                val = Number(val);
                if (val > max) {
                    this.currentValue = max;
                } else if (val < min) {
                    this.currentValue = min;
                } else {
                    this.currentValue = val;
                }
            } else {
                event.target.value = this.currentValue;
            }
        }
    }
});