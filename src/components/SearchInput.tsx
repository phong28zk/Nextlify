"use client"

import { useRouter } from "next/navigation";
import React, {useState, useEffect} from "react";

import qs from 'query-string';

import userDebounce from "@/hooks/useDebounce";
import Input from "./Input";

interface SearchInputProps {
    input: string;
}

const SearchInput = () => {
    const router = useRouter();
    const [value, setValue] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const debouncedValue = userDebounce<string>(value, 500);

    useEffect(() => {
        const query = {
            title: debouncedValue,
        };

        const url = qs.stringifyUrl({
            url: '/search',
            query: query
        });

        router.push(url);
    }, [debouncedValue, router]);

    return (
        <Input
            placeholder="For what"
            value= {value}
            onChange = {(e) => setValue(e.target.value)}
        />
    )
}

export default SearchInput;