"use client";

import { useEffect, useState } from "react";
import { getJobCategories } from "@/services/jobService";

export default function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getJobCategories();
                setCategories(data);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    return {
        categories,
        loading,
        error,
    };
}