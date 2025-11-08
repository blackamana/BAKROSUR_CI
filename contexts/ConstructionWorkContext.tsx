import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useMemo, useState } from 'react';

import {
  CONSTRUCTION_WORKS,
  ConstructionWork,
  WorkType,
  WorkUrgency,
} from '@/constants/construction-works';

export const [ConstructionWorkContext, useConstructionWorks] = createContextHook(() => {
  const [works] = useState<ConstructionWork[]>(CONSTRUCTION_WORKS);
  const [filters, setFilters] = useState<{
    workType: WorkType | null;
    urgency: WorkUrgency | null;
    cityId: string | null;
    minBudget: number | null;
    maxBudget: number | null;
  }>({
    workType: null,
    urgency: null,
    cityId: null,
    minBudget: null,
    maxBudget: null,
  });

  const filteredWorks = useMemo(() => {
    return works.filter((work) => {
      if (filters.workType && work.workType !== filters.workType) {
        return false;
      }
      if (filters.urgency && work.urgency !== filters.urgency) {
        return false;
      }
      if (filters.cityId && work.cityId !== filters.cityId) {
        return false;
      }
      if (filters.minBudget && work.budget < filters.minBudget) {
        return false;
      }
      if (filters.maxBudget && work.budget > filters.maxBudget) {
        return false;
      }
      return true;
    });
  }, [works, filters]);

  const featuredWorks = useMemo(() => {
    return works.filter((w) => w.featured);
  }, [works]);

  const urgentWorks = useMemo(() => {
    return works.filter((w) => w.urgency === 'URGENTE');
  }, [works]);

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      workType: null,
      urgency: null,
      cityId: null,
      minBudget: null,
      maxBudget: null,
    });
  }, []);

  return useMemo(
    () => ({
      works,
      filteredWorks,
      featuredWorks,
      urgentWorks,
      filters,
      updateFilters,
      clearFilters,
    }),
    [works, filteredWorks, featuredWorks, urgentWorks, filters, updateFilters, clearFilters]
  );
});
