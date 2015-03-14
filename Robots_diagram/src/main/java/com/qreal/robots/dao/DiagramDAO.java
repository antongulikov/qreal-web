package com.qreal.robots.dao;

import com.qreal.robots.model.diagram.Diagram;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by vladzx on 07.11.14.
 */
@Repository
@Transactional
public class DiagramDAO {
    private static final Logger LOG = Logger.getLogger(DiagramDAO.class);

    @Autowired
    private SessionFactory sessionFactory;

    public DiagramDAO() {
    }

    public DiagramDAO(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public void save(Diagram diagram) {
        LOG.debug("saving diagram");
        Session session = sessionFactory.getCurrentSession();
        session.save(diagram);
    }

    public Diagram openById(Long diagramId) {
        Session session = sessionFactory.getCurrentSession();
        return (Diagram) session.get(Diagram.class, diagramId);
    }

    public Diagram openByName(String name) {
        LOG.debug("open diagram");
        Session session = sessionFactory.getCurrentSession();
        List<Diagram> diagrams = session.createQuery("from Diagram where name=?").setParameter(0, name).list();
        return (diagrams.isEmpty() ? null : diagrams.get(0));

    }
}
