package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.JobDTO;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Job}.
 */
public interface JobService {
    /**
     * Save a job.
     *
     * @param jobDTO the entity to save.
     * @return the persisted entity.
     */
    JobDTO save(JobDTO jobDTO);

    /**
     * Partially updates a job.
     *
     * @param jobDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<JobDTO> partialUpdate(JobDTO jobDTO);

    /**
     * Get all the jobs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<JobDTO> findAll(Pageable pageable);

    /**
     * Get all the jobs with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<JobDTO> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" job.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<JobDTO> findOne(UUID id);

    /**
     * Delete the "id" job.
     *
     * @param id the id of the entity.
     */
    void delete(UUID id);
}
