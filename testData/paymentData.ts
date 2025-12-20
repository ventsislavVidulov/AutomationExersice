import { PaymentDetails } from '../types/PaymentDetails';

export const validPaymentData: PaymentDetails = {
    name: 'Valid Payment Data',
    inputCardName: 'John Doe',
    inputCardNumber: '4100 0000 0000 0000',
    inputCVC: '123',
    inputExpiryMonth: '01',
    inputExpiryYear: '2027'
};

export const invalidPaymentData: PaymentDetails[] = [
    {
        name: 'Invalid Card Number Payment Data',
        inputCardName: 'John Doe',
        inputCardNumber: 'INVALID CARD NUMBER',
        inputCVC: '123',
        inputExpiryMonth: '01',
        inputExpiryYear: '2027'
    },
    {
        name: 'Invalid CVC Payment Data',
        inputCardName: 'John Doe',
        inputCardNumber: '4100 0000 0000 0000',
        inputCVC: 'INVALID CVC',
        inputExpiryMonth: '01',
        inputExpiryYear: '2027'
    },
    {
        name: 'Expired Card Payment Data',
        inputCardName: 'John Doe',
        inputCardNumber: '4100 0000 0000 0000',
        inputCVC: '123',
        inputExpiryMonth: '01',
        inputExpiryYear: '2024'
    },
];

export const emptyPaymentData: PaymentDetails[] = [
        {
        name: 'Empty Card Name Payment Data',
        inputCardName: '',
        inputCardNumber: '4100 0000 0000 0000',
        inputCVC: '123',
        inputExpiryMonth: '01',
        inputExpiryYear: '2027'
    },
    {
        name: 'Empty Card Number Payment Data',
        inputCardName: 'John Doe',
        inputCardNumber: '',
        inputCVC: '123',
        inputExpiryMonth: '01',
        inputExpiryYear: '2027'
    },
    {
        name: 'Empty CVC Payment Data',
        inputCardName: 'John Doe',
        inputCardNumber: '4100 0000 0000 0000',
        inputCVC: '',
        inputExpiryMonth: '01',
        inputExpiryYear: '2027'
    },
    {
        name: 'Empty Expiry Month Payment Data',
        inputCardName: 'John Doe',
        inputCardNumber: '4100 0000 0000 0000',
        inputCVC: '123',
        inputExpiryMonth: '',
        inputExpiryYear: '2027'
    },
    {
        name: 'Empty Expiry Year Payment Data',
        inputCardName: 'John Doe',
        inputCardNumber: '4100 0000 0000 0000',
        inputCVC: '123',
        inputExpiryMonth: '01',
        inputExpiryYear: ''
    }
]
