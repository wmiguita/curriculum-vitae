(function( ready ) {
  var filterInput = document.getElementById( "skill-filter" ),
      clearFilterBtn = document.getElementById( "clear-filter" ),
      filterTimer = null,
      skills = [].slice.call( document.getElementsByClassName( "skill" ) ),// to array
      fuseOptions = { keys: [ 'dataset.tags' ] },
      // Ref: https://www.geeksforgeeks.org/fuzzy-search-in-javascrip/
      fuseSearch = new Fuse( skills, fuseOptions ),
      onTransitionEnd = function onTransitionEnd( e ) {
        if ( e.target.classList.contains( 'show' ) ) {
          e.target.classList.remove( 'hidden' );
        } else {
          e.target.classList.add( 'hidden' );
        }
      },
      filter = function filter( text ) {
        var filtered = fuseSearch.search( text ),
            showItems = filtered.map( function( i ) { return i.item } );

        //cleaning previous filter
        skills.forEach( function( skill ) {
          if( showItems.includes( skill )) {
            skill.classList.add( 'show' );
            skill.classList.remove( 'hidden' );
          } else {
            skill.classList.remove( 'show' );
          }
        });

        document.getElementById( 'habilities' ).classList.add( 'filtered' );
      },
      filterListener = function filterListener( event ) {
        if( filterTimer ) clearTimeout( filterTimer );
        filterTimer = setTimeout( filter.bind( null, event.target.value ), 250 );
      }
      clearFilter = function clearFilter( event ) {
        document.getElementById( 'habilities' ).classList.remove( 'filtered' );
        filterInput.value = "";
        skills.forEach( function( skill ) {
          skill.classList.remove( 'show' );
        });
      };

  if( filterInput ) {
    filterInput.addEventListener( 'keyup', filterListener );
  }

  if( clearFilterBtn ) {
    clearFilterBtn.addEventListener( 'click', clearFilter );
  }

  skills.forEach( function( skill ) {
    skill.addEventListener( 'transitionend', onTransitionEnd );
  });
})();
