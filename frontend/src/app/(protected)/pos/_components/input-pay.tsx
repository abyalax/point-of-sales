import { useMemoizedCallback } from '~/components/hooks/use-memoized-callback';
import { Button, Flex, Input, InputWrapper } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate } from '@tanstack/react-router';

import { useCallback, useEffect, useRef } from 'react';
import { FaPrint, FaSave } from 'react-icons/fa';

import { useCreateTransaction } from '../_hooks/use-create-transaction';
import { useCartState } from '../_hooks/use-cart-state';
import { useCartStore } from '../_hooks/use-cart-store';
import { DEFAULT } from '~/common/const/default';
import { formatCurrency } from '~/utils/format';
import type { ChangeEvent, FocusEvent } from 'react';
import Big from 'big.js';

export function InputPay() {
  const navigate = useNavigate();
  const { mutateAsync: createTransaction } = useCreateTransaction({
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: (
          <p>
            Successfully save transaction{' '}
            <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underlined' }} onClick={() => navigate({ to: '/products' })}>
              See
            </span>
          </p>
        ),
        autoClose: false,
        color: 'green',
      });
    },
    onError: (error) => {
      console.log('useCreateTransaction error : ', error);
      notifications.show({
        color: 'red',
        title: 'Failed to save transaction',
        message: (error as Error).message,
      });
    },
  });
  const setPayReceived = useCartStore((s) => s.setPayReceived);
  const setPayReturn = useCartStore((s) => s.setPayReturn);
  const clearCart = useCartStore((s) => s.clearCart);
  const isEmptyCart = useCartStore((s) => s.isEmptyCart);
  const printStruct = useCartStore((s) => s.printStruct);
  const pay_received = useCartState((s) => s.pay_received);
  const pay_return = useCartState((s) => s.pay_return);
  const total = useCartState((s) => s.total);
  const carts = useCartState((s) => s);
  const inputRef = useRef<HTMLInputElement>(null);
  const pay = pay_received ? new Big(pay_received) : new Big(0);
  const isPaySufficient = pay.gte(total);
  const canSaveTransaction = !isEmptyCart() && isPaySufficient;

  const handleSaveTransaction = async () => {
    await createTransaction(carts);
    clearCart();
  };

  const debouncedCalculate = useMemoizedCallback(
    (value: string) => {
      const fallbackedValue = value === '' ? '0' : value;
      const payAmount = new Big(fallbackedValue);
      const totalAmount = new Big(total);
      const change = payAmount.minus(totalAmount);
      const finalChange = change.gte(0) ? change.toString() : '0';
      setPayReturn(finalChange);
    },
    [total],
    DEFAULT.DEBOUNCE_INPUT,
  );

  useEffect(() => {
    debouncedCalculate(pay_received);
  }, [debouncedCalculate, pay_received, total]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '' || /^\d+$/.test(value)) {
        setPayReceived(value);
        debouncedCalculate(value);
      }
    },
    [debouncedCalculate, setPayReceived],
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const payAmount = parseFloat(value);

      if (value === '' || isNaN(payAmount) || payAmount < 0) {
        const fallbackValue = '0';
        setPayReceived(fallbackValue);
        debouncedCalculate(fallbackValue);
        notifications.show({
          color: 'red',
          title: 'Oops',
          message: 'Pembayaran tidak boleh kosong atau negatif',
          position: 'top-center',
        });
      }
    },
    [debouncedCalculate, setPayReceived],
  );

  return (
    <Flex w={'100%'} justify={'start'} direction={'column'} gap={'md'}>
      <InputWrapper
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
          gap: '10px',
        }}
      >
        <label htmlFor="bayar">Bayar</label>
        <Input
          ref={inputRef}
          prefix="Rp "
          placeholder="Jumlah Pembayaran"
          name="bayar"
          onChange={handleChange}
          onBlur={handleBlur}
          value={pay_received}
        />
      </InputWrapper>
      <InputWrapper
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
          gap: '10px',
        }}
      >
        <label htmlFor="kembalian">Kembali</label>
        <Input placeholder="Kembalian" name="kembalian" prefix="Rp " value={formatCurrency(pay_return)} readOnly color="black" />
      </InputWrapper>
      <Flex gap={'lg'} mt={'lg'} justify={'end'}>
        <Button variant="default" leftSection={<FaPrint />} disabled={!canSaveTransaction} onClick={() => printStruct(carts)}>
          Cetak
        </Button>
        <Button variant="default" leftSection={<FaSave />} onClick={handleSaveTransaction} disabled={!canSaveTransaction}>
          Simpan
        </Button>
      </Flex>
    </Flex>
  );
}
