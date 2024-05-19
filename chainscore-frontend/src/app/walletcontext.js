import React, { createContext, useContext, useState } from 'react';
import { NearContext } from '@/context';

export const useWallet = () => useContext(NearContext);

