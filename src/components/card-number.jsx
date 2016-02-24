import React from 'react';

class CardNumber extends React.Component {

    constructor(props) {
        super(props);
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
        if(/[A-Za-z]/.test(e.key)) {
            e.preventDefault();
            return;
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

    handleKeyup = (e) => {
        if([16,17,18,91].indexOf(e.which) > -1){
            return;
        }
        var value = this.refs.form.textContent;

        this.refs.form.innerHTML = this.format(value);

        var range = document.createRange();
        range.selectNodeContents(this.refs.form);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        this.props.onChange(this.refs.form.textContent);
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
            <div onFocus={this.clearPlaceholder} onBlur={this.setPlaceholder} {...this.props} ref="form" contentEditable={true} onKeyUp={this.handleKeyup} onKeyPress={this.handleKeypress}>{this.renderPlaceholder()}</div>
        )
    }

}

CardNumber.propTypes = {
    onChange: React.PropTypes.func
}

CardNumber.defaultProps = {
    onChange: function() {},
    placeholder:''
}

export default CardNumber;
