package com.fgm.flow.dao;

import com.querydsl.core.types.dsl.EntityPathBase;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.List;

/**
 * Adding general Queries to AbstractDAO 
 * 
 * @param <T> Type
 * @param <K> Primary key (id)
 * @author hajo
 */
public abstract class AbstractQuery<T, K> extends AbstractDAO<T, K>{

    private final EntityPathBase<T> queryObject;  // Needed because of QueryDSL
   
    protected AbstractQuery(Class<T> clazz, EntityPathBase<T> queryObject) {
        super(clazz);
        this.queryObject = queryObject;
    }

    public int count() {
        JPAQueryFactory qf = new JPAQueryFactory(getEntityManager());
        return qf.from(queryObject).fetch().size();
    }

    public void clear() {
        JPAQueryFactory qf = new JPAQueryFactory(getEntityManager());
        qf.delete(queryObject).execute();
    }

    public List<T> findAll() {
        JPAQueryFactory qf = new JPAQueryFactory(getEntityManager());
        List<T> found = qf.select(queryObject)
                .from(queryObject)
                .fetch();
        return found;
    }

    public List<T> findRange(int start, int nRecords) {
        JPAQueryFactory qf = new JPAQueryFactory(getEntityManager());
        List<T> found = qf.select(queryObject)
                .from(queryObject)
                .offset(start)
                .limit(nRecords)
                .fetch();
        return found;
    }

}
