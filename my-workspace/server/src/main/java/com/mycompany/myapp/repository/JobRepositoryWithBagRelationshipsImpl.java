package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Job;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class JobRepositoryWithBagRelationshipsImpl implements JobRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Job> fetchBagRelationships(Optional<Job> job) {
        return job.map(this::fetchTasks);
    }

    @Override
    public Page<Job> fetchBagRelationships(Page<Job> jobs) {
        return new PageImpl<>(fetchBagRelationships(jobs.getContent()), jobs.getPageable(), jobs.getTotalElements());
    }

    @Override
    public List<Job> fetchBagRelationships(List<Job> jobs) {
        return Optional.of(jobs).map(this::fetchTasks).orElse(Collections.emptyList());
    }

    Job fetchTasks(Job result) {
        return entityManager
            .createQuery("select job from Job job left join fetch job.tasks where job.id = :id", Job.class)
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Job> fetchTasks(List<Job> jobs) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, jobs.size()).forEach(index -> order.put(jobs.get(index).getId(), index));
        List<Job> result = entityManager
            .createQuery("select job from Job job left join fetch job.tasks where job in :jobs", Job.class)
            .setParameter("jobs", jobs)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
