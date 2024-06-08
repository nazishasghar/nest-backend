export type OmitAndPickPartial<T, OmitType extends keyof T, PickType extends keyof T | never> = Omit<T, OmitType | PickType> &
    Partial<Pick<T, PickType>>
