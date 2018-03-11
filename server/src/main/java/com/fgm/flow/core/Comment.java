package com.fgm.flow.core;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Column;
import javax.persistence.UniqueConstraint;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.persistence.FetchType;
import javax.persistence.MapsId;
import javax.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import com.google.gson.annotations.Expose;

/**
 * A FLow post comment
 *
 * @author fgm
 */
@NoArgsConstructor
@EqualsAndHashCode(of = {"id"})
@Entity
@Table(
        name="comment"
)
public class Comment implements Serializable
{
    @Id
    @Getter
    @Setter
    @Column(nullable=false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Expose
    private int id;

    @Getter
    @Setter
    @Column(nullable=false)
    @Expose
    private String text;
    
    @ManyToOne
    @JoinColumn(name="POST", nullable=false)
    @Getter
    @Setter
    private Post post;
    
    @ManyToOne
    @JoinColumn(name="COMMENTER", nullable=false)
    @Getter
    @Setter
    private User commenter;
    
    // Use enum instead perhaps?
    @Getter
    @Setter
    @Column(nullable=false)
    @Expose
    private int status;
    
    @Getter
    @Setter
    @Column(nullable=false)
    @Temporal(TemporalType.TIMESTAMP)
    @Expose
    private Date time;
    
    public final void timeStamp()
    {
        time = new Date();
    }
    
    public Comment(String text, Post post, User commenter)
    {
        this.id = 0; // Dummy value
        this.text = text;
        this.post = post;
        this.commenter = commenter;
        this.status = 0; // 0 = visible, currently. May get replaced with enums
        timeStamp();
    }
    
    public Comment(String text, Post post, User commenter, int status)
    {
        this.id = 0; // Dummy value
        this.text = text;
        this.post = post;
        this.commenter = commenter;
        this.status = status;
        timeStamp();
    }
    
    public String toString()
    {
        return "id: " + id;
    }
}