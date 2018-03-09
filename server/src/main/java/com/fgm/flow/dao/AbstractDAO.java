package com.fgm.flow.dao;

import javax.persistence.EntityManager;

/**
 * Base class for any persisting collection (DAO = Data access object, also
 * called a Facade)
 * Just the basic CRUD operations
 * 
 * This is pure JPA
 *
 * @param <T> Type
 * @param <K> Primary key (id)
 * @author hajo
 */
public abstract class AbstractDAO<T, K> {

    private final Class<T> clazz;
   
    // To be overridden by subclasses
    public abstract EntityManager getEntityManager();
    // This one if for testing outside container
    public abstract void setEntityManager(EntityManager em);

    protected AbstractDAO(Class<T> clazz) {
        this.clazz = clazz;
    }

    public void create(T t) {
        getEntityManager().persist(t);
        flush();    // Because of Exceptionhandling (else will get EJBException)
    }

    public void delete(K id) {
        T t = getEntityManager().getReference(clazz, id);
        getEntityManager().remove(t);
    }

    // Updated as result
    public T update(T t) {
        return getEntityManager().merge(t);
    }

    public T find(K id) {
        return getEntityManager().find(clazz, id);
    }

    protected void flush() {
        getEntityManager().flush();
    }
}