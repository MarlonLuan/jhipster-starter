package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.JobRepository;
import com.mycompany.myapp.service.JobService;
import com.mycompany.myapp.service.dto.JobDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.persistence.EntityManager;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Job}.
 */
@RestController
@RequestMapping("/api/jobs")
public class JobResource {

    private static final Logger LOG = LoggerFactory.getLogger(JobResource.class);

    private static final String ENTITY_NAME = "job";

    @Value("${jhipster.clientApp.name:jhipster}")
    private String applicationName;

    private final JobService jobService;

    private final JobRepository jobRepository;

    private final ObjectMapper om;

    private final EntityManager em;

    public JobResource(JobService jobService, JobRepository jobRepository, ObjectMapper om, EntityManager em) {
        this.jobService = jobService;
        this.jobRepository = jobRepository;
        this.om = om;
        this.em = em;
    }

    /**
     * {@code POST  /jobs} : Create a new job.
     *
     * @param jobDTO the jobDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new jobDTO, or with status {@code 400 (Bad Request)} if the job already has an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<JobDTO> createJob(@RequestBody JobDTO jobDTO) throws URISyntaxException {
        LOG.debug("REST request to save Job : {}", jobDTO);
        if (jobDTO.getId() != null) {
            throw BadRequestAlertException.idexists(ENTITY_NAME);
        }
        jobDTO = jobService.save(jobDTO);
        return ResponseEntity.created(new URI("/api/jobs/" + jobDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, jobDTO.getId().toString()))
            .body(jobDTO);
    }

    /**
     * {@code PUT  /jobs/:id} : Updates an existing job.
     *
     * @param id the id of the jobDTO to save.
     * @param jobDTO the jobDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobDTO,
     * or with status {@code 400 (Bad Request)} if the jobDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the jobDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<JobDTO> updateJob(@PathVariable(value = "id", required = false) final UUID id, @RequestBody JobDTO jobDTO)
        throws URISyntaxException {
        LOG.debug("REST request to update Job : {}, {}", id, jobDTO);
        if (jobDTO.getId() == null) {
            throw BadRequestAlertException.idnull(ENTITY_NAME);
        }
        if (!Objects.equals(id, jobDTO.getId())) {
            throw BadRequestAlertException.idinvalid(ENTITY_NAME);
        }

        if (!jobRepository.existsById(id)) {
            throw BadRequestAlertException.idnotfound(ENTITY_NAME);
        }

        jobDTO = jobService.update(jobDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, jobDTO.getId().toString()))
            .body(jobDTO);
    }

    /**
     * {@code PATCH  /jobs/:id} : Partial updates given fields of an existing job, field will ignore if it is null
     *
     * @param id the id of the jobDTO to save.
     * @param jobDTO the jobDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobDTO,
     * or with status {@code 400 (Bad Request)} if the jobDTO is not valid,
     * or with status {@code 404 (Not Found)} if the jobDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the jobDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<JobDTO> partialUpdateJob(
        @PathVariable(value = "id", required = false) final UUID id,
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @io.swagger.v3.oas.annotations.media.Content(
                schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = JobDTO.class)
            )
        ) @RequestBody ObjectNode jobDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partially update Job : {}, {}", id, jobDTO);
        var idNode = jobDTO.remove("id");
        if (idNode == null || idNode.isNull()) {
            throw BadRequestAlertException.idnull(ENTITY_NAME);
        }
        if (!idNode.isString()) {
            throw BadRequestAlertException.idinvalid(ENTITY_NAME);
        }
        if (!Objects.equals(id.toString(), idNode.stringValue())) {
            throw BadRequestAlertException.idinvalid(ENTITY_NAME);
        }

        return jobService
            .findOne(id)
            .map(existingJob -> {
                try {
                    em.clear();
                    existingJob = this.om.readerForUpdating(existingJob).readValue(jobDTO);
                    return existingJob;
                } catch (JacksonException e) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid job", e);
                }
            })
            .map(jobService::update)
            .map(res ->
                ResponseEntity.ok()
                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId().toString()))
                    .body(res)
            )
            .orElseThrow(() -> BadRequestAlertException.idnotfound(ENTITY_NAME));
    }

    /**
     * {@code GET  /jobs} : get all the Jobs.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Jobs in body.
     */
    @GetMapping("")
    public ResponseEntity<List<JobDTO>> getAllJobs(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "filter", required = false) String filter,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        if ("jobhistory-is-null".equals(filter)) {
            LOG.debug("REST request to get all Jobs where jobHistory is null");
            return new ResponseEntity<>(jobService.findAllWhereJobHistoryIsNull(), HttpStatus.OK);
        }
        LOG.debug("REST request to get a page of Jobs");
        Page<JobDTO> page;
        if (eagerload) {
            page = jobService.findAllWithEagerRelationships(pageable);
        } else {
            page = jobService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /jobs/:id} : get the "id" job.
     *
     * @param id the id of the jobDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the jobDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJob(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get Job : {}", id);
        Optional<JobDTO> jobDTO = jobService.findOne(id);
        return ResponseUtil.wrapOrNotFound(jobDTO);
    }

    /**
     * {@code DELETE  /jobs/:id} : delete the "id" job.
     *
     * @param id the id of the jobDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete Job : {}", id);
        jobService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
