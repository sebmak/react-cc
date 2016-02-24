import React from 'react';

class CardNumber extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.process(this.props.value);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillReceiveProps(props) {
        this.process(props.value);
    }

    detectCardType = (number) => {
        var re = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/,
            diners: /^(36|38|30[0-5])/,
            discover: /^(6011|65|64[4-9]|622)/,
            jcb: /^35/
        };
        if (re.visa.test(number)) {
            return 'VISA';
        } else if (re.mastercard.test(number)) {
            return 'MASTERCARD';
        } else if (re.amex.test(number)) {
            return 'AMEX';
        } else if (re.diners.test(number)) {
            return 'DINERS';
        } else if (re.discover.test(number)) {
            return 'DISCOVER';
        } else if (re.jcb.test(number)) {
            return 'JCB';
        } else {
            return undefined;
        }
    }

    handleKeypress = (e) => {
        var val = String.fromCharCode(e.keyCode);
        if(/[A-Za-z]/.test(val) && !e.metaKey && !e.altKey && !e.ctrlKey) {
            e.preventDefault();
        }

        if(/[0-9]/.test(val)){
            e.preventDefault();
            var value = this.refs.form.textContent;

            this.process(value, val);

            this.props.onChange(this.refs.form.textContent);
        }
    }

    split = (value, regex) => {
        var strings = value.split(regex).filter((c)=>{return c});
        var ret = [];

        for(var key in strings) {
            ret.push('<span>'+strings[key]+'</span>');
        }

        return ret.join('');
    }

    trim = (value, type) => {
        switch (type) {
            case 'VISA':
                return value.substring(0,16);
            case 'DISCOVER':
                return value.substring(0,16);
            case 'JCB':
                return value.substring(0,16);
            case 'MASTERCARD':
                return value.substring(0,16);
            case 'AMEX':
                return value.substring(0,15);
            case 'DINERS':
                return value.substring(0,14);
            default:
                return value;
        }
    }

    format = (value) => {
        var type = this.detectCardType(value);
        if(type === undefined) {
            return value;
        }

        value = this.trim(value, type);

        switch (type) {
            case 'AMEX':
                return this.split(value, /(\d{1,4})(\d{1,6})?(\d{1,5})?/);
                break;
            default:
                return this.split(value, /(\d{1,4})/g);
        }
    }

    getCurrentCursorPosition = (node, offset) => {
        node = node;
        offset = offset;

        var nodeIndex = Array.prototype.indexOf.call(node.parentNode.parentNode.children, node.parentNode);

        var characterPositon = 0;
        var currentNode = 0;
        while(currentNode < nodeIndex) {
            characterPositon += node.parentNode.parentNode.children[currentNode].textContent.length;
            currentNode++;
        }
        return characterPositon + offset;
    }

    setCursor = (position) => {
        var range = document.createRange();
        var sel = window.getSelection();

        if(this.refs.form.children.length > 0) {
            var cursorNode = this.refs.form.children[0].childNodes[0];
            var cursorPosition = cursorNode.textContent.length;

            if(cursorPosition >= position) {
                cursorPosition = position;
            } else {
                var i = 1;
                var positionLeft = position - cursorPosition;
                while(positionLeft >= 0) {
                    if(!this.refs.form.children[i]) {
                        cursorPosition = cursorNode.textContent.length;
                        break;
                    };
                    cursorNode = this.refs.form.children[i].childNodes[0];
                    positionLeft = positionLeft - cursorNode.textContent.length;
                    if(positionLeft <= 0) {
                        cursorPosition = cursorNode.textContent.length + positionLeft;
                        break;
                    }
                    i++;
                }

            }

            range.setStart(cursorNode,cursorPosition);
            range.setEnd(cursorNode,cursorPosition);

            sel.removeAllRanges();
            sel.addRange(range);
        } else {
            range.setStart(this.refs.form.childNodes[0] || this.refs.form, position);
            range.setEnd(this.refs.form.childNodes[0] || this.refs.form, position);

            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    process = (value, val) => {
        if(value !== '' || val) {
            var sel = window.getSelection();
            if(sel.rangeCount > 0) {
                var position = this.getCurrentCursorPosition(sel.anchorNode,sel.anchorOffset);
                var range = sel.getRangeAt(0);
                if(!range.collapsed) {
                    position = this.getCurrentCursorPosition(range.startContainer, range.startOffset);

                    var end = range.toString().length - 1 + position;
                    value = [value.slice(0, position), value.slice(end+1, value.length)].join('');
                }
            }
            value = [value.slice(0, position), val, value.slice(position)].join('')
            this.refs.form.innerHTML = this.format(value);
            position++;
            if(position) {
                this.setCursor(position);
            }
        }
    }

    clearPlaceholder = () => {
        if(this.refs.form.textContent === this.props.placeholder) {
            this.refs.form.textContent = '';
        }
    }

    setPlaceholder = () => {
        if(this.refs.form.textContent === '') {
            this.refs.form.innerHTML = React.__SECRET_DOM_SERVER_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.renderToStaticMarkup(this.renderPlaceholder());
        }
    }

    renderPlaceholder = () => {
        return <span style={{opacity: '0.5'}}>{this.props.placeholder}</span>
    }

    render() {
        return (
            <div onFocus={this.clearPlaceholder} onBlur={this.setPlaceholder} {...this.props} ref="form" contentEditable={true} onKeyDown={this.handleKeypress}>{this.renderPlaceholder()}</div>
        )
    }

}

CardNumber.propTypes = {
    onChange: React.PropTypes.func
}

CardNumber.defaultProps = {
    onChange: function() {},
    placeholder:'',
    value: ''
}

export default CardNumber;
