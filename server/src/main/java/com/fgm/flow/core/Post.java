package com.fgm.flow.core;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
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
import javax.persistence.OneToMany;
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
 * A post
 *
 * @author fgm
 */
@NoArgsConstructor
@EqualsAndHashCode(of = {"id"})
@Entity
@Table(
        name="post"
)
public class Post implements Serializable
{
    @Id
    @Getter
    @Setter
    @Column(nullable=false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    //@JoinColumn(name = "employer_id", referencedColumnName = "id")
    //@ManyToOne
    @Expose
    private int id;
    
    @Getter
    @Setter
    @Column(nullable=false)
    @Expose
    private String title;
    
    @Getter
    @Setter
    @Column(nullable=false)
    @Expose
    private String text;
    
    @ManyToOne
    @JoinColumn(name="POSTER", nullable=false)
    @Getter
    @Setter
    private User poster;

    @ManyToOne
    @JoinColumn(name="USERGROUP", nullable=false)
    @Getter
    @Setter
    private UserGroup userGroup;
    
    @Getter
    @Setter
    @Column(nullable=false)
    @Temporal(TemporalType.TIMESTAMP)
    @Expose
    private Date time;
    
    @OneToMany(mappedBy="post", fetch=FetchType.LAZY, cascade = CascadeType.ALL)
    @Setter
    @Getter
    private List<Comment> comments;
    
    /*
    public void addComment(Comment comment)
    {
        comments.add(comment);
    }
    */
    
    public Post(String title, String text, UserGroup userGroup, User poster)
    {
        this.id = 0; // Dummy value
        this.title = title;
        this.text = text;
        this.userGroup = userGroup;
        this.poster = poster;
        this.time = new Date();
    }
    
    public String toString()
    {
        return "id: " + id;
    }
}