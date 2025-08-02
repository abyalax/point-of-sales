import { Button, Flex, Input, InputWrapper } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

import { useCallback, useRef, useState } from 'react';
import { FaPrint, FaSave } from 'react-icons/fa';

import { useCartState } from '../_hooks/use-cart-state';
import { DEFAULT } from '~/common/const/default';
import { formatCurrency } from '~/utils/format';
import type { ChangeEvent, FocusEvent } from 'react';
import Big from 'big.js';

export function InputPay() {
  const total = useCartState((s) => s.total);
  const inputRef = useRef<HTMLInputElement>(null);

  const [returnPay, setReturnPay] = useState<string>('0');
  const [pay, setPay] = useState<string>('0');

  const debouncedCalculate = useMemoizedCallback(
    (value: string) => {
      const fallbackedValue = value === '' ? '0' : value;
      const payAmount = new Big(fallbackedValue);
      const totalAmount = new Big(total);
      const change = payAmount.minus(totalAmount);
      const finalChange = change.gte(0) ? change.toString() : '0';
      setReturnPay(finalChange);
    },
    [total],
    DEFAULT.DEBOUNCE_INPUT,
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      console.log('handleChange');
      if (value === '' || /^\d+$/.test(value)) {
        setPay(value);
        debouncedCalculate(value);
      }
    },
    [debouncedCalculate],
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      console.log('handleBlur');
      const value = e.target.value;
      const payAmount = parseFloat(value);

      if (value === '' || isNaN(payAmount) || payAmount < 0) {
        const fallbackValue = '0';
        setPay(fallbackValue);
        debouncedCalculate(fallbackValue);
        notifications.show({
          color: 'red',
          title: 'Oops',
          message: 'Pembayaran tidak boleh kosong atau negatif',
          position: 'top-center',
        });
      }
    },
    [debouncedCalculate],
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
        <Input ref={inputRef} prefix="Rp " placeholder="Jumlah Pembayaran" name="bayar" onChange={handleChange} onBlur={handleBlur} value={pay} />
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
        <Input placeholder="Kembalian" name="kembalian" prefix="Rp " value={formatCurrency(returnPay.toString())} readOnly color="black" />
      </InputWrapper>
      <Flex gap={'lg'} mt={'lg'} justify={'end'}>
        <Button variant="default" leftSection={<FaPrint />}>
          Cetak
        </Button>
        <Button variant="default" leftSection={<FaSave />}>
          Simpan
        </Button>
      </Flex>
    </Flex>
  );
}

// Custom hook untuk memoized debounced callback
function useMemoizedCallback(callback: (value: string) => void, deps: unknown[], delay: number) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallback = useCallback(callback, deps);
  return useDebouncedCallback(memoizedCallback, delay);
}
